import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import {User} from "./User"

@Entity()
export class KycDocument {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.kycDocuments, { nullable: false })
  user!: User;

  @Column("jsonb")
  documents!: { fileType: string; filePath: string }[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}


