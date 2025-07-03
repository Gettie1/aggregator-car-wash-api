import { IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  profileId: string; // ID of the profile associated with the admin
  @IsString()
  isSuperAdmin: boolean; // Indicates if the admin is a super admin
}
