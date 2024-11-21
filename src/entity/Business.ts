import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from "typeorm";
import "reflect-metadata";

@Entity()
export class Business extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  contactPerson!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  phoneNumber!: string;

  @Column()
  location!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
