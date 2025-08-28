import { PartialType } from '@nestjs/mapped-types';
import { CreatePangkalanLpgDto } from './create-pangkalan-lpg.dto';

export class UpdatePangkalanLpgDto extends PartialType(CreatePangkalanLpgDto) {}