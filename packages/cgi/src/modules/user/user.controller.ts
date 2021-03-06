import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  CGICodeMap,
  CGIResponse,
  infoRequest,
  infoResponse,
  warn,
} from '../../utils';
import { QueryParams, Maybe, WithKeywords } from '../../types';
import { RequestId, UserName } from '../../decorators';
import { UserService } from './user.service';
import {
  CheckTokenParams,
  CreateUserParams,
  UpdateUserParams,
} from './user.interface';

let cgiUserService: Maybe<UserService> = null;

@Controller('/cgi/user')
export class UserController {
  constructor(private readonly userService: UserService) {
    cgiUserService = userService;
  }

  @Get()
  async queryUser(
    @RequestId() requestId,
    @Query() query: WithKeywords<QueryParams>,
  ) {
    infoRequest(requestId, 'User.controller.queryUser', query);
    const result = await this.userService.queryUserEntities(query);
    infoResponse(requestId, 'User.controller.queryUser', { result });
    return CGIResponse.success(requestId, result);
  }

  @Post()
  async createUser(@RequestId() requestId, @Body() user: CreateUserParams) {
    infoRequest(requestId, 'User.controller.queryUser', { user });
    if (await this.userService.checkUserExists(user.name)) {
      warn('User.controller.queryUser', `User "${user.name}" already exists`, {
        requestId,
      });
      return CGIResponse.failed(requestId, CGICodeMap.UserExists);
    }

    const result = await this.userService.createUserEntity(user);
    infoResponse(requestId, 'User.controller.createUser', { result });
    return CGIResponse.success(requestId, result);
  }

  @Post('/:id')
  async updateUser(
    @RequestId() requestId,
    @Body() user: UpdateUserParams,
    @Param('id') id: string,
  ) {
    infoRequest(requestId, 'User.controller.updateUser', { user, id });
    if (!(await this.userService.checkUserExists(user.name))) {
      warn('User.controller.updateUser', `User "${user.name}" not exists`, {
        requestId,
      });
      return CGIResponse.failed(requestId, CGICodeMap.UserNotExists);
    }

    const result = await this.userService.updateUserEntity(parseInt(id), user);
    infoResponse(requestId, 'User.controller.updateUser', { result });
    return CGIResponse.success(requestId, result);
  }

  @Get('/access_token')
  async checkAccessToken(
    @RequestId() requestId,
    @Query() { token, username }: CheckTokenParams,
  ) {
    infoRequest(requestId, 'User.controller.checkAccessToken', {
      token,
      username,
    });

    if (!(await this.userService.checkUserExists(username))) {
      warn(
        'User.controller.checkAccessToken',
        `User "${username}" not exists`,
        {
          requestId,
        },
      );
      return CGIResponse.failed(requestId, CGICodeMap.UserNotExists);
    }

    const accessToken = await this.userService.getAccessToken(username);
    const result = { tokenValid: token === accessToken };
    infoResponse(requestId, 'User.controller.checkAccessToken', { result });
    return CGIResponse.success(requestId, result);
  }

  @Post('/access_token/:id')
  async generateAccessToken(
    @RequestId() requestId,
    @UserName() username,
    @Param('id') id: string,
  ) {
    infoRequest(requestId, 'User.controller.generateAccessToken', {
      username,
      id,
    });

    if (!(await this.userService.checkUserExistsById(parseInt(id, 10)))) {
      warn('User.controller.generateAccessToken', `UserId "${id}" not exists`, {
        requestId,
      });
      return CGIResponse.failed(requestId, CGICodeMap.UserNotExists);
    }

    const result = await this.userService.generateAccessToken(parseInt(id));
    infoResponse(requestId, 'User.controller.generateAccessToken', {
      ...result,
      token: '*',
    });
    return CGIResponse.success(requestId, result);
  }
}

export function getUserService() {
  return cgiUserService;
}
