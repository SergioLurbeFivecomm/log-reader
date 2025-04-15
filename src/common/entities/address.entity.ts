import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Device } from './device.entity';

@Entity('ADDRESS')
export class Address {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column('varchar', { length: 255, nullable: false })
    primary: string;

    @Column('varchar', { length: 255, nullable: false })
    secondary: string;

    @Column('varchar', {name: "fota_ip", length: 255, nullable: false })
    fotaIp: string;

    @OneToMany(() => Device, device => device.address)
    device?: Device[];
}
