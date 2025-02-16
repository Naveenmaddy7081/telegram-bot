import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SubscribedUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  city: string;

  @Column({ default: false })
  blocked: boolean;
}