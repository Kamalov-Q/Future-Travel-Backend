import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentStatus } from './entities/comment.entity';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // ─── Public endpoint ────────────────────────────────────────────────────────

  @Post()
  @ApiOperation({
    summary: 'Submit a comment (public)',
    description:
      'Anyone can submit a comment without registration. Comment goes to pending status and awaits admin approval before appearing on the tour.',
  })
  @ApiResponse({
    status: 201,
    description: 'Comment submitted successfully and pending admin approval',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        firstName: 'Abdulloh',
        lastName: 'Karimov',
        content: "Turga juda yaxshi dam oldim! Mehmonxona a'lo darajada edi.",
        status: 'pending',
        tourId: '660e8400-e29b-41d4-a716-446655440111',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  // ─── Admin endpoints ────────────────────────────────────────────────────────

  @Get('admin/all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[ADMIN] Get all comments',
    description:
      'Returns all comments, optionally filtered by status. Pending comments need admin review.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: CommentStatus,
    example: 'pending',
    description: 'Filter by comment status',
  })
  @ApiResponse({
    status: 200,
    description: 'List of comments',
    schema: {
      example: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          firstName: 'Abdulloh',
          lastName: 'Karimov',
          content: "Turga juda yaxshi dam oldim!",
          status: 'pending',
          tourId: '660e8400-e29b-41d4-a716-446655440111',
          tour: { destination: 'Анталия', region: 'Турция' },
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  findAll(@Query('status') status?: CommentStatus) {
    return this.commentService.findAll(status);
  }

  @Patch('admin/:id/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[ADMIN] Approve comment',
    description:
      'Approves a pending comment. Once approved, it will be visible on the tour page.',
  })
  @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Comment approved' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  approve(@Param('id') id: string) {
    return this.commentService.approve(id);
  }

  @Patch('admin/:id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[ADMIN] Reject comment',
    description: 'Rejects a pending comment. It will NOT be shown on the tour page.',
  })
  @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Comment rejected' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  reject(@Param('id') id: string) {
    return this.commentService.reject(id);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[ADMIN] Delete comment',
    description:
      'Permanently deletes a comment. Admin can delete but cannot edit comments.',
  })
  @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
