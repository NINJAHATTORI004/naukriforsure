import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SharedModule } from './shared/shared.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { IamModule } from './modules/iam/iam.module';
import { UsersModule } from './modules/users/users.module';
import { CandidateModule } from './modules/candidate/candidate.module';
import { ResumeModule } from './modules/resume/resume.module';

@Module({
  imports: [
    CqrsModule.forRoot(),
    SharedModule,
    InfrastructureModule,
    UsersModule,
    IamModule,
    CandidateModule,
    ResumeModule,
  ],
})
export class AppModule {}