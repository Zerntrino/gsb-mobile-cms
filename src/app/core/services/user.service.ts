import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApiResponse, BaseService, Paginate } from './base.service';
import { User, CardReward, CardPomition, Admin } from '../models/user.model';
// import { createDecipheriv, randomBytes, createHash } from 'crypto';
// import { createHash, createDecipheriv } from 'crypto-browserify';
// import crypto from 'crypto-browserify';
// import * as crypto from 'crypto';
import * as crypto from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  constructor(public http: HttpClient) {
    super();
  }

  appId = '9df6dceb';
  salt = this.generateSalt();

  generateSalt(byteLength = 8): string {
    const salt = crypto.lib.WordArray.random(byteLength);
    return salt.toString(crypto.enc.Hex);
  }

  encryptAES(plaintext: string, password: string, saltHex: string): string {
    const salt = crypto.enc.Hex.parse(saltHex);
    const iterations = 1024;
    const keySize = 256 / 32; // AES-256 key size in words

    // Deriving key and IV from password and salt
    const key = crypto.PBKDF2(password, salt, {
      keySize: keySize,
      iterations: iterations,
      hasher: crypto.algo.SHA1,
    });

    // Encrypting the plaintext
    const encrypted = crypto.AES.encrypt(plaintext, key, {
      iv: crypto.enc.Hex.parse('00000000000000000000000000000000'),
    });

    return encrypted.ciphertext.toString(crypto.enc.Hex); // Return as hex string
  }

  getUserProfile(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`/api/user/${id}/profile`);
  }

  async getUser(id: string): Promise<ApiResponse<User> | undefined> {
    // const test = await this.encryptAES(
    //   'ABCDE12345ABCDE12345',
    //   'changeit',
    //   'd0ba2eef035b7ddc'
    // );
    // console.log('test', test);

    const citizenId = await this.encryptAES(id, this.appId, this.salt);
    const custIdCreditCard = await this.encryptAES(
      `100${id}`,
      this.appId,
      this.salt
    );
    const custIdCreditCard2 = await this.encryptAES(
      `800${id}`,
      this.appId,
      this.salt
    );

    const u = await this.http
      .post<ApiResponse<User>>(
        `/api/cms/card/user/information`,
        {
          citizenId: citizenId,
          custIdCreditCard: custIdCreditCard,
          custIdRevolvLoan: custIdCreditCard2,
        },
        {
          headers: {
            'x-app-id': this.appId,
            'x-salt-hex': this.salt,
          },
        }
      )
      .toPromise();

    return u;
  }

  async getRewardHistory(
    id: string,
    ref: string,
    params?: HttpParams
  ): Promise<ApiResponse<CardReward[]> | undefined> {
    const u = await this.http
      .get<ApiResponse<CardReward[]>>(
        `/api/cms/card/user/referece/${ref}/reward/history`,

        {
          params: params,
        }
      )
      .toPromise();

    return u;
  }
  async getRewardHistoryTotalPage(
    id: string,
    ref: string,
    params?: HttpParams
  ): Promise<ApiResponse<Paginate> | undefined> {
    const u = await this.http
      .get<ApiResponse<Paginate>>(
        `/api/cms/card/user/referece/${ref}/reward/history/totalpage`,

        {
          params: params,
        }
      )
      .toPromise();

    return u;
  }

  async getPromotionHistory(
    id: string,
    ref: string,
    params?: HttpParams
  ): Promise<ApiResponse<CardPomition[]> | undefined> {
    const u = await this.http
      .get<ApiResponse<CardPomition[]>>(
        `/api/cms/card/user/referece/${ref}/promotion/history`,

        {
          params: params,
        }
      )
      .toPromise();

    return u;
  }

  async getPromotionHistoryTotalPage(
    id: string,
    ref: string,
    params?: HttpParams
  ): Promise<ApiResponse<Paginate> | undefined> {
    const u = await this.http
      .get<ApiResponse<Paginate>>(
        `/api/cms/card/user/referece/${ref}/promotion/history/totalpage`,

        {
          params: params,
        }
      )
      .toPromise();

    return u;
  }

  getList(params?: HttpParams): Observable<ApiResponse<Admin[]>> {
    return this.http.get<ApiResponse<Admin[]>>(`/api/cms/user`, {
      params: params,
    });
  }
  getListTotal(params?: HttpParams): Observable<ApiResponse<Paginate>> {
    return this.http.get<ApiResponse<Paginate>>(`/api/cms/user/totalpage`, {
      params: params,
    });
  }

  get(id: string): Observable<ApiResponse<Admin>> {
    return this.http.get<ApiResponse<Admin>>(`/api/cms/user/${id}`, {});
  }
  remove(id: string): Observable<ApiResponse<Admin>> {
    return this.http.delete<ApiResponse<Admin>>(`/api/cms/user/${id}`, {});
  }
  create(object: object): Observable<ApiResponse<Admin>> {
    return this.http.post<ApiResponse<Admin>>(`/api/cms/user`, object);
  }
  update(id: number, object: object): Observable<ApiResponse<Admin>> {
    return this.http.put<ApiResponse<Admin>>(`/api/cms/user/${id}`, object);
  }
}
