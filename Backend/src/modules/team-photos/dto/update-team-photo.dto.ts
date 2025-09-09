import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamPhotoDto } from './create-team-photo.dto';

export class UpdateTeamPhotoDto extends PartialType(CreateTeamPhotoDto) {}