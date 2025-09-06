import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { JenisBbmService } from './jenis-bbm.service';
import { CreateJenisBbmDto } from './dto/create-jenis-bbm.dto';
import { UpdateJenisBbmDto } from './dto/update-jenis-bbm.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../auth/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';

@Controller('jenis-bbm')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JenisBbmController {
    constructor(private readonly jenisBbmService: JenisBbmService) {}

    // CREATE
    @Post()
    @Roles(UserRole.ADMIN)
    async create(@Body() createJenisBbmDto: CreateJenisBbmDto) {
        return this.jenisBbmService.create(createJenisBbmDto);
    }

    // READ ALL or ONE by Query
    @Get()
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    async findAllOrOne(@Query('id_jenis_bbm') idJenisBbm?: number) {
        if (idJenisBbm) {
            return this.jenisBbmService.findOne(+idJenisBbm);
        }
        return this.jenisBbmService.findAll();
    }

    // READ ONE by Body JSON
    @Post('find')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    async findOneByBody(@Body('id_jenis_bbm', ParseIntPipe) id: number) {
        if (!id) {
            throw new BadRequestException('id_jenis_bbm harus disertakan dalam body');
        }
        return this.jenisBbmService.findOne(id);
    }

    // UPDATE via URL param
    @Patch(':id')
    @Roles(UserRole.ADMIN)
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateJenisBbmDto: UpdateJenisBbmDto) {
        return this.jenisBbmService.update(id, updateJenisBbmDto);
    }

    // UPDATE via Body JSON
    @Patch()
    @Roles(UserRole.ADMIN)
    async updateByBody(@Body() body: { id_jenis_bbm: number } & UpdateJenisBbmDto) {
        const { id_jenis_bbm, ...updateData } = body;
        if (!id_jenis_bbm) {
            throw new BadRequestException('id_jenis_bbm harus disertakan dalam body');
        }
        return this.jenisBbmService.update(id_jenis_bbm, updateData);
    }

    // DELETE via URL param
    @Delete(':id')
    @Roles(UserRole.ADMIN)
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.jenisBbmService.remove(id);
        return { message: `Jenis BBM dengan ID ${id} berhasil dihapus` };
    }

    // DELETE via Body JSON
    @Delete()
    @Roles(UserRole.ADMIN)
    async removeByBody(@Body('id_jenis_bbm', ParseIntPipe) id: number) {
        if (!id) {
            throw new BadRequestException('id_jenis_bbm harus disertakan dalam body');
        }
        await this.jenisBbmService.remove(id);
        return { message: `Jenis BBM dengan ID ${id} berhasil dihapus` };
    }
}