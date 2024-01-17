using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Project.Data.Migrations
{
    /// <inheritdoc />
    public partial class Once : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProjectInfos",
                columns: table => new
                {
                    idProject = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    avatar = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    process = table.Column<int>(type: "int", nullable: false),
                    visibility = table.Column<int>(type: "int", nullable: false),
                    isDeleted = table.Column<bool>(type: "bit", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectInfos", x => x.idProject);
                });

            migrationBuilder.CreateTable(
                name: "Posts",
                columns: table => new
                {
                    idPost = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Major = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Exp = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    View = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IsBlock = table.Column<bool>(type: "bit", nullable: false),
                    idProject = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProjectidProject = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IdUser = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Posts", x => x.idPost);
                    table.ForeignKey(
                        name: "FK_Posts_ProjectInfos_ProjectidProject",
                        column: x => x.ProjectidProject,
                        principalTable: "ProjectInfos",
                        principalColumn: "idProject");
                });

            migrationBuilder.CreateTable(
                name: "ProjectInvitations",
                columns: table => new
                {
                    idProjectInvitation = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idProject = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    isAccept = table.Column<bool>(type: "bit", nullable: true),
                    confirmedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectInvitations", x => x.idProjectInvitation);
                    table.ForeignKey(
                        name: "FK_ProjectInvitations_ProjectInfos_idProject",
                        column: x => x.idProject,
                        principalTable: "ProjectInfos",
                        principalColumn: "idProject",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectMembers",
                columns: table => new
                {
                    idProjectMember = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idProject = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    isAcept = table.Column<bool>(type: "bit", nullable: true),
                    confirmedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectMembers", x => x.idProjectMember);
                    table.ForeignKey(
                        name: "FK_ProjectMembers_ProjectInfos_idProject",
                        column: x => x.idProject,
                        principalTable: "ProjectInfos",
                        principalColumn: "idProject");
                });

            migrationBuilder.CreateTable(
                name: "PostComment",
                columns: table => new
                {
                    idPostComment = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    idPost = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PostidPost = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IdUser = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostComment", x => x.idPostComment);
                    table.ForeignKey(
                        name: "FK_PostComment_Posts_PostidPost",
                        column: x => x.PostidPost,
                        principalTable: "Posts",
                        principalColumn: "idPost");
                });

            migrationBuilder.CreateTable(
                name: "PostImage",
                columns: table => new
                {
                    idPostImage = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    imageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    idPost = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PostidPost = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostImage", x => x.idPostImage);
                    table.ForeignKey(
                        name: "FK_PostImage_Posts_PostidPost",
                        column: x => x.PostidPost,
                        principalTable: "Posts",
                        principalColumn: "idPost");
                });

            migrationBuilder.CreateTable(
                name: "PostLikes",
                columns: table => new
                {
                    idPostLikes = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    idPost = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PostidPost = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostLikes", x => x.idPostLikes);
                    table.ForeignKey(
                        name: "FK_PostLikes_Posts_PostidPost",
                        column: x => x.PostidPost,
                        principalTable: "Posts",
                        principalColumn: "idPost");
                });

            migrationBuilder.CreateTable(
                name: "PostCommentLike",
                columns: table => new
                {
                    idPostCommentLike = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    idPostComment = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PostCommentidPostComment = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostCommentLike", x => x.idPostCommentLike);
                    table.ForeignKey(
                        name: "FK_PostCommentLike_PostComment_PostCommentidPostComment",
                        column: x => x.PostCommentidPostComment,
                        principalTable: "PostComment",
                        principalColumn: "idPostComment");
                });

            migrationBuilder.CreateTable(
                name: "PostReply",
                columns: table => new
                {
                    idPostReply = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    idPostComment = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PostCommentidPostComment = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostReply", x => x.idPostReply);
                    table.ForeignKey(
                        name: "FK_PostReply_PostComment_PostCommentidPostComment",
                        column: x => x.PostCommentidPostComment,
                        principalTable: "PostComment",
                        principalColumn: "idPostComment");
                });

            migrationBuilder.CreateTable(
                name: "PostReplyLike",
                columns: table => new
                {
                    idPostReplyLike = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    idPostReply = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PostReplyidPostReply = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostReplyLike", x => x.idPostReplyLike);
                    table.ForeignKey(
                        name: "FK_PostReplyLike_PostReply_PostReplyidPostReply",
                        column: x => x.PostReplyidPostReply,
                        principalTable: "PostReply",
                        principalColumn: "idPostReply");
                });

            migrationBuilder.CreateIndex(
                name: "IX_PostComment_PostidPost",
                table: "PostComment",
                column: "PostidPost");

            migrationBuilder.CreateIndex(
                name: "IX_PostCommentLike_PostCommentidPostComment",
                table: "PostCommentLike",
                column: "PostCommentidPostComment");

            migrationBuilder.CreateIndex(
                name: "IX_PostImage_PostidPost",
                table: "PostImage",
                column: "PostidPost");

            migrationBuilder.CreateIndex(
                name: "IX_PostLikes_PostidPost",
                table: "PostLikes",
                column: "PostidPost");

            migrationBuilder.CreateIndex(
                name: "IX_PostReply_PostCommentidPostComment",
                table: "PostReply",
                column: "PostCommentidPostComment");

            migrationBuilder.CreateIndex(
                name: "IX_PostReplyLike_PostReplyidPostReply",
                table: "PostReplyLike",
                column: "PostReplyidPostReply");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_ProjectidProject",
                table: "Posts",
                column: "ProjectidProject");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInvitations_idProject",
                table: "ProjectInvitations",
                column: "idProject");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectMembers_idProject",
                table: "ProjectMembers",
                column: "idProject");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PostCommentLike");

            migrationBuilder.DropTable(
                name: "PostImage");

            migrationBuilder.DropTable(
                name: "PostLikes");

            migrationBuilder.DropTable(
                name: "PostReplyLike");

            migrationBuilder.DropTable(
                name: "ProjectInvitations");

            migrationBuilder.DropTable(
                name: "ProjectMembers");

            migrationBuilder.DropTable(
                name: "PostReply");

            migrationBuilder.DropTable(
                name: "PostComment");

            migrationBuilder.DropTable(
                name: "Posts");

            migrationBuilder.DropTable(
                name: "ProjectInfos");
        }
    }
}
