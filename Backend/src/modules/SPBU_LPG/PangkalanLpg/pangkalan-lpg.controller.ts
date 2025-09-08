import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { PangkalanLpgService } from './pangkalan-lpg.service';
import { CreatePangkalanLpgDto } from './dto/create-pangkalan-lpg.dto';
import { UpdatePangkalanLpgDto } from './dto/update-pangkalan-lpg.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';

@Controller('pangkalan-lpg')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PangkalanLpgController {
    constructor(private readonly pangkalanLpgService: PangkalanLpgService) { }

    // CREATE
    @Post()
    @Roles(UserRole.ADMIN)
    create(@Body() dto: CreatePangkalanLpgDto) {
        return this.pangkalanLpgService.create(dto);
    }

    // READ ALL or ONE by Query
    @Get()
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    async findAllOrOne(@Query('id_pangkalan_lpg') idPangkalanLpg?: number) {
        if (idPangkalanLpg) {
            return this.pangkalanLpgService.findOne(+idPangkalanLpg);
        }
        return this.pangkalanLpgService.findAll();
    }

    // READ ONE by Body JSON
    @Post('find')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    async findOneByBody(@Body('id_pangkalan_lpg', ParseIntPipe) id: number) {
        if (!id) {
            throw new BadRequestException('id_pangkalan_lpg harus disertakan dalam body');
        }
        return this.pangkalanLpgService.findOne(id);
    }

    // UPDATE via URL param
    @Patch(':id')
    @Roles(UserRole.ADMIN)
    updateByUrl(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePangkalanLpgDto) {
        return this.pangkalanLpgService.update(id, dto);
    }

    // UPDATE via Body JSON
    @Patch()
    @Roles(UserRole.ADMIN)
    updateByBody(@Body() dto: UpdatePangkalanLpgDto & { id_pangkalan_lpg: number }) {
        if (!dto.id_pangkalan_lpg) {
            throw new BadRequestException('id_pangkalan_lpg harus disertakan dalam body');
        }
        return this.pangkalanLpgService.update(dto.id_pangkalan_lpg, dto);
    }

    // DELETE via URL param
    @Delete(':id')
    @Roles(UserRole.ADMIN)
    removeByUrl(@Param('id', ParseIntPipe) id: number) {
        return this.pangkalanLpgService.remove(id);
    }

    // DELETE via Body JSON
    @Delete()
    @Roles(UserRole.ADMIN)
    removeByBody(@Body('id_pangkalan_lpg', ParseIntPipe) id: number) {
        if (!id) {
            throw new BadRequestException('id_pangkalan_lpg harus disertakan dalam body');
        }
        return this.pangkalanLpgService.remove(id);
    }
}