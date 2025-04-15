import {
    Entity,
    PrimaryColumn,
    Column,
    OneToMany,
    JoinColumn
} from 'typeorm';
import { GreyListItem } from './grey-list-item.entity';
import { WhiteListItem } from './white-list-item.entity';


@Entity('METER')
export class Meter {
    @PrimaryColumn()
    meter_id: string;
    
    @Column('varchar', { nullable: true })
    manufacturer: string;

    @Column('varchar', { nullable: true })
    model: string;

    @Column('varchar', { nullable: true })
    vertical: string;

    @Column('varchar', { nullable: true })
    key: string;

    @OneToMany(() => GreyListItem, greyList => greyList.device)
    greyLists: GreyListItem[];

    @OneToMany(() => WhiteListItem, whiteList => whiteList.device)
    whiteLists: WhiteListItem[];
}
