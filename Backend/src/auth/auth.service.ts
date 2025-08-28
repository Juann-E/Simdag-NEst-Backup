import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../modules/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, pass: string) {
    console.log('DEBUG LOGIN - username:', username, 'password:', pass);

    const user = await this.userService.findByUsername(username);
    console.log('DEBUG LOGIN - user from DB:', user);

    if (!user) {
      console.log('DEBUG LOGIN - User tidak ditemukan');
      return null;
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    console.log('DEBUG LOGIN - bcrypt compare result:', isPasswordValid);

    if (user && isPasswordValid) {
      const { password, ...result } = user;
      return result;
    }

    console.log('DEBUG LOGIN - Password salah');
    return null;
  }


  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}