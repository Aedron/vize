import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ResourceEntity } from './resource.entity';
import {
  CreateResourceParams,
  QueryResourceParams,
} from './resource.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(ResourceEntity)
    private readonly resourceRepository: Repository<ResourceEntity>,
    private readonly userServices: UserService,
  ) {}

  public async getResourceEntityById(id: number) {
    return this.resourceRepository.findOne(id);
  }

  public async queryResourceEntities({
    startPage = 0,
    pageSize = 20,
    type,
    extension,
    keywords,
  }: QueryResourceParams) {
    const whereOptions = {};
    if (type) {
      whereOptions['type'] = type;
    }
    if (extension) {
      whereOptions['extension'] = extension;
    }

    let where = [whereOptions];
    if (keywords) {
      where = ['filename', 'extension', 'url'].map(key => ({
        ...whereOptions,
        [key]: Like(`%${keywords}%`),
      }));
    }

    const data = await this.resourceRepository.find({
      order: { id: 'DESC' },
      take: pageSize,
      skip: pageSize * startPage,
      where,
    });
    const total = await this.resourceRepository.count({ where });
    return { total, data };
  }

  public async createResourceEntity(
    username: string,
    { type, extension, url, filename }: CreateResourceParams,
  ) {
    return this.resourceRepository.insert({
      type,
      extension,
      filename,
      url,
      createdTime: new Date(),
      user: await this.userServices.getUserEntityByName(username),
    });
  }

  public deleteResourceEntity(id: number) {
    return this.resourceRepository.delete({ id });
  }
}
