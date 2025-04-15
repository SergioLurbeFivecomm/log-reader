import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Device } from './device.entity';


@Entity('ALARMS')
export class Alarms {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column('int', {name:"sd_not_detected", nullable: true, unsigned: true })
    sdNotDetected: number;

    @Column('int', {name:"sd_formated", nullable: true, unsigned: true })
    sdFormated: number;

    @Column('int', {name:"sd_could_not_format", nullable: true, unsigned: true })
    sdCouldNotFormat: number;

    @Column('int', {name:"no_wmb_read", nullable: true, unsigned: true })
    noWmbRead: number;

    @Column('int', {name:"primary_server_failed", nullable: true, unsigned: true })
    primaryServerFailed: number;

    @Column('int', {name:"all_backups_filled", nullable: true, unsigned: true })
    allBackupsFilled: number;

    @Column('int', {name:"sim_failed", nullable: true, unsigned: true })
    simFailed: number;

    @Column('int', {name:"eprom_failed", nullable: true, unsigned: true })
    epromFailed: number;

    @Column('int', {name:"sd_could_not_mount", nullable: true, unsigned: true })
    sdCouldNotMount?: number;

    @Column('timestamp', { nullable: false })
    timestamp: string;

    @ManyToOne(() => Device)
    @JoinColumn({ name: 'device_id' })
    device: Device;

}