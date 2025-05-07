import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApiResponse, BaseService } from './base.service';
import { User } from '../models/user.model';
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
  ): Promise<ApiResponse<User> | undefined> {
    const u = await this.http
      .get<ApiResponse<User>>(
        // `/api/cms/user/referece/${ref}/reward/history`,
        `/api/cms/card/user/referece/3049142011001100400221224/reward/history`,

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
  ): Promise<ApiResponse<User> | undefined> {
    const u = await this.http
      .get<ApiResponse<User>>(
        // `/api/cms/user/referece/${ref}/promotion/history`,
        `/api/cms/card/user/referece/3049142011001100400221224/promotion/history`,
        {
          params: params,
        }
      )
      .toPromise();

    return u;
  }
}
