import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { SpbuService } from './spbu.service';
import { CreateSpbuDto } from './dto/create-spbu.dto';
import { UpdateSpbuDto } from './dto/update-spbu.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';

@Controller('spbu')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SpbuController {
    constructor(private readonly spbuService: SpbuService) { }

    // CREATE
    @Post()
    @Roles(UserRole.ADMIN)
    create(@Body() dto: CreateSpbuDto) {
        return this.spbuService.create(dto);
    }

    // READ ALL or ONE by Query
    @Get()
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    async findAllOrOne(@Query('id_spbu') idSpbu?: number) {
        if (idSpbu) {
            return this.spbuService.findOne(+idSpbu);
        }
        return this.spbuService.findAll();
    }

    // READ ONE by Body JSON
    @Post('find')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    async findOneByBody(@Body('id_spbu', ParseIntPipe) id: number) {
        if (!id) {
            throw new BadRequestException('id_spbu harus disertakan dalam body');
        }
        return this.spbuService.findOne(id);
    }

    // UPDATE via URL param
    @Patch(':id')
    @Roles(UserRole.ADMIN)
    updateByUrl(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSpbuDto) {
        return this.spbuService.update(id, dto);
    }

    // UPDATE via Body JSON
    @Patch()
    @Roles(UserRole.ADMIN)
    updateByBody(@Body() dto: UpdateSpbuDto & { id_spbu: number }) {
        if (!dto.id_spbu) {
            throw new BadRequestException('id_spbu harus disertakan dalam body');
        }
        return this.spbuService.update(dto.id_spbu, dto);
    }

    // DELETE via URL param
    @Delete(':id')
    @Roles(UserRole.ADMIN)
    removeByUrl(@Param('id', ParseIntPipe) id: number) {
        return this.spbuService.remove(id);
    }

    // DELETE via Body JSON
    @Delete()
    @Roles(UserRole.ADMIN)
    removeByBody(@Body('id_spbu', ParseIntPipe) id: number) {
        if (!id) {
            throw new BadRequestException('id_spbu harus disertakan dalam body');
        }
        return this.spbuService.remove(id);
    }
}
