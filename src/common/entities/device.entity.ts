import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Coverage } from './coverage.entity';
import { WiotData } from './wiot-data.entity';
import { GreyListItem } from './grey-list-item.entity';
import { WhiteListItem } from './white-list-item.entity';
import { Address } from './address.entity';
import { Alarms } from './alarms.entity';

@Entity('DEVICE')
@Index(["sn"])
export class Device {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { unique: true, length: 40 })
    imei: string;

    @Column('timestamp')
    timestamp?: string;

    @Column('varchar', {name:"report_time", length: 10, default: '23:00' })
    reportTime: string;

    @Column('varchar', { length: 30, nullable: true })
    fw: string;

    @Column('varchar', { length: 30, nullable: true })
    hw: string;

    @Column('int', {name:"signal_threshold", default: '-120' })
    signalThreshold: number;

    @Column('varchar', { length: 50 })
    sn: string;

    @Column('double', { nullable: true })
    battery: number;

    @Column('varchar', { length: 30, nullable: true })
    apn: string;

    @Column('varchar', {name:"filter_vertical", length: 500, nullable: true })
    filterVertical: string;

    @Column('varchar', {name:"filter_model", length: 100, nullable: true })
    filterModel: string;

    @Column('varchar', {name:"filter_manufacturer", length: 100, nullable: true })
    filterManufacturer: string;

    @Column('varchar', {name:"wmb_modes", length: 255, nullable: true })
    wmbModes?: string;

    @Column('int', {name:"wmb_measurement_interval", nullable: true })
    wmbMeasurementInterval: number;

    @Column('int', {name:"wmb_measurement_window", default: '25' })
    wmbMeasurementWindow: number;

    @Column('int', { name: "send_period",nullable: true })
    sendPeriod?: number;

    @Column('int', { name: "read_period",nullable: true })
    readPeriod?: number;

    @Column('varchar', { length: 50, nullable: true })
    imsi: string;

    @Column('varchar', {name:"sequans_version", length: 50, nullable: true })
    sequansVersion: string;

    @Column('datetime', {name:"last_message_sent", nullable: true })
    lastMessageSent: string;

    @Column('varchar', { length: 100, nullable: true })
    fota: string;

    @Column('varchar', { length: 100, nullable: true })
    key?: string;

    @OneToMany(() => Coverage, coverage => coverage.device)
    coverages: Coverage[];

    @OneToMany(() => WiotData, wiotData => wiotData.device)
    datas: WiotData[];

    @OneToMany(() => GreyListItem, greyList => greyList.device)
    greyLists: GreyListItem[];

    @OneToMany(() => WhiteListItem, whiteList => whiteList.device)
    whiteLists: WhiteListItem[];

    @OneToMany(() => Alarms, alarms => alarms.device)
    alarms: Alarms[];

    @ManyToOne(() => Address)
    @JoinColumn({ name: 'address_id', referencedColumnName: 'id' })
    address: Address;
}
