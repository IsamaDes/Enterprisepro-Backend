import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { KycDocument } from './KycDocument';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;  // Use PostgreSQL's auto-increment primary key

  @Column()
  businessName!: string;

  @Column()
  contactPerson!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column()
  location!: string;

  @Column()
  password!: string;

  @OneToMany(() => KycDocument, (KycDocument) => KycDocument.user)
  kycDocuments!: KycDocument[];
}
