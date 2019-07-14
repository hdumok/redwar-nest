import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

// 实体
@Entity('nature_admin')
export class User {
  @PrimaryColumn()
  id: string;

  @Column({
    unique: true,
  })
  account: string;

  @Column({
    default: '',
  })
  password: string;

  @Column({
    default: '',
  })
  name: string;

  @Column({
    default: '',
  })
  headimgurl: string;

  @Column({
    default: '',
  })
  token: string;

  @UpdateDateColumn()
  updated: Date;

  @CreateDateColumn()
  created: Date;

  @Column('timestamp', {
    nullable: true,
  })
  deleted: Date;

  @BeforeInsert()
  async generateId() {
    this.id = Date.now().toString();
  }
}
