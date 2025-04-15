import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Device } from './device.entity';

@Entity('COVERAGE')
export class Coverage {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('int', { nullable: true, unsigned: true })
  cc: number;

  @Column('varchar', { length: 10, nullable: true })
  nc: string;

  @Column('int', { nullable: true })
  tac: number;

  @Column('varchar', { length: 100, nullable: true })
  band: string;

  @Column('int', { nullable: true })
  earfcn: number;

  @Column('float', { nullable: true })
  rsrp: number;

  @Column('float', { nullable: true })
  rsrq: number;

  @Column('int', { nullable: true })
  pwd: number;

  @Column('int', { nullable: true })
  paging: number;

  @Column('varchar', { length: 10, nullable: true })
  cid: string;

  @Column('int', { nullable: true })
  bw: number;

  @Column('varchar', {name:"id_cov", length: 100, nullable: true })
  idCov: string;

  @Column('timestamp', { nullable: false })
  timestamp: string;

  @ManyToOne(() => Device)
  @JoinColumn({ name: 'device_id', referencedColumnName: 'id' })
  device: Device;
}
