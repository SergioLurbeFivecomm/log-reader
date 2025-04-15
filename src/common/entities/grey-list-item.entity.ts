import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Device } from './device.entity';
import { Meter } from './meter.entity';
import { DateTime } from 'luxon';


@Entity('GREYLISTITEM')
export class GreyListItem {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column('int', { name:'num_veces', nullable: true })
    numVeces: number;

    @Column('int', { nullable: true })
    rssi: number;

    @Column('timestamp')
    timestamp: string;

    @ManyToOne(() => Device)
    @JoinColumn({ name: 'device_id' })
    device?: Device;

    @ManyToOne(() => Meter)
    @JoinColumn({ name: 'meter_id' })
    meter?: Meter;
}
