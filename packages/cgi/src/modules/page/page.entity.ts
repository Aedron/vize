import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { RecordStatus } from '../../types';
import { BizEntity } from '../biz/biz.entity';
import { HistoryEntity } from '../history/history.entity';
import { UserEntity } from '../user/user.entity';

@Entity()
export class PageEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 128, nullable: false })
  key: string;

  @Column({ type: 'datetime', nullable: false })
  createdTime: Date;

  @Column({ type: 'varchar', length: 16, nullable: false })
  layoutMode: string;

  @Column({ type: 'varchar', length: 16, nullable: false })
  pageMode: string;

  @Column({ type: 'tinyint', nullable: false })
  isTemplate: number;

  @Column({ type: 'varchar', length: 16, nullable: true })
  generator?: string;

  @Column({ type: 'varchar', length: 128, nullable: false })
  container: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  url?: string;

  @Column({ type: 'tinyint', nullable: false, default: 1 })
  status: RecordStatus;

  @ManyToOne(
    () => UserEntity,
    user => user.id,
    { nullable: false },
  )
  @JoinColumn()
  owner: UserEntity;

  @ManyToOne(
    () => BizEntity,
    biz => biz.id,
    { nullable: false },
  )
  @JoinColumn()
  biz: BizEntity;

  @OneToOne(
    () => HistoryEntity,
    history => history.id,
    { nullable: false },
  )
  @JoinColumn()
  latestHistory: HistoryEntity;
}
