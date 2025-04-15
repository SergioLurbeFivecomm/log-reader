import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Device } from './device.entity';
import { Meter } from './meter.entity';


@Entity('WHITELISTITEM')
export class WhiteListItem {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column('timestamp', { nullable: true })
    timestamp: string;

    @Column('tinyint', { name: 'is_active', default: 1 })
    isActive: boolean;

    @ManyToOne(() => Device)
    @JoinColumn({ name: 'device_id' })
    device: Device;

    @ManyToOne(() => Meter)
    @JoinColumn({ name: 'meter_id' })
    meter: Meter;
}
