import { Entity, Column, OneToMany, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';  // Import MongoDB's ObjectId
import { KycDocument } from './KycDocument';

@Entity()
export class User {
  @ObjectIdColumn()
  id!: ObjectId;  // Use MongoDB's ObjectId

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
