import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Device } from './device.entity';
import { Meter } from './meter.entity';

@Entity('WIOT_DATA')
export class WiotData {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column('int', { nullable: true })
    hour: number;

    @Column('int', { nullable: true })
    minutes?: number;

    @Column('int', { nullable: true })
    seconds?: number;

    @Column('timestamp', { nullable: true })
    received: string;

    @Column('varchar', {name:"data_frame", length: 6200, nullable: true })
    dataFrame: string;

    @Column('int', { nullable: true })
    rssi: number;

    @ManyToOne(() => Device)
    @JoinColumn({ name: 'device_id', referencedColumnName: 'id' })
    device: Device;

    @ManyToOne(() => Meter)
    @JoinColumn({ name: 'meter_id', referencedColumnName: 'meter_id' })
    meter: Meter;

}
