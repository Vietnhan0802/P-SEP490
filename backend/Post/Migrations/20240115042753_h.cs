using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Post.Migrations
{
    /// <inheritdoc />
    public partial class h : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    idProject = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    avatar = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    process = table.Column<int>(type: "int", nullable: false),
                    visibility = table.Column<int>(type: "int", nullable: false),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.idProject);
                });

            migrationBuilder.CreateTable(
                name: "Posts",
                columns: table => new
                {
                    idPost = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
                        name: "FK_Posts_Projects_ProjectidProject",
                        column: x => x.ProjectidProject,
                        principalTable: "Projects",
                        principalColumn: "idProject");
                });

            migrationBuilder.CreateTable(
                name: "ProjectInvitation",
                columns: table => new
                {
                    idProjectInvitation = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idProject = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    isAccept = table.Column<bool>(type: "bit", nullable: false),
                    confirmedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ProjectidProject = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectInvitation", x => x.idProjectInvitation);
                    table.ForeignKey(
                        name: "FK_ProjectInvitation_Projects_ProjectidProject",
                        column: x => x.ProjectidProject,
                        principalTable: "Projects",
                        principalColumn: "idProject");
                });

            migrationBuilder.CreateTable(
                name: "ProjectMember",
                columns: table => new
                {
                    idProjectMember = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idProject = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    isManager = table.Column<bool>(type: "bit", nullable: false),
                    isAcept = table.Column<bool>(type: "bit", nullable: false),
                    confirmedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ProjectidProject = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectMember", x => x.idProjectMember);
                    table.ForeignKey(
                        name: "FK_ProjectMember_Projects_ProjectidProject",
                        column: x => x.ProjectidProject,
                        principalTable: "Projects",
                        principalColumn: "idProject");
                });

            migrationBuilder.CreateTable(
                name: "PostComments",
                columns: table => new
                {
                    idPostComment = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    idPost = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PostidPost = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IdUser = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostComments", x => x.idPostComment);
                    table.ForeignKey(
                        name: "FK_PostComments_Posts_PostidPost",
                        column: x => x.PostidPost,
                        principalTable: "Posts",
                        principalColumn: "idPost");
                });

            migrationBuilder.CreateTable(
                name: "PostReplies",
                columns: table => new
                {
                    idPostReply = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    idPostComment = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PostCommentidPostComment = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IdUser = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostReplies", x => x.idPostReply);
                    table.ForeignKey(
                        name: "FK_PostReplies_PostComments_PostCommentidPostComment",
                        column: x => x.PostCommentidPostComment,
                        principalTable: "PostComments",
                        principalColumn: "idPostComment");
                });

            migrationBuilder.CreateIndex(
                name: "IX_PostComments_PostidPost",
                table: "PostComments",
                column: "PostidPost");

            migrationBuilder.CreateIndex(
                name: "IX_PostReplies_PostCommentidPostComment",
                table: "PostReplies",
                column: "PostCommentidPostComment");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_ProjectidProject",
                table: "Posts",
                column: "ProjectidProject");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectInvitation_ProjectidProject",
                table: "ProjectInvitation",
                column: "ProjectidProject");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectMember_ProjectidProject",
                table: "ProjectMember",
                column: "ProjectidProject");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PostReplies");

            migrationBuilder.DropTable(
                name: "ProjectInvitation");

            migrationBuilder.DropTable(
                name: "ProjectMember");

            migrationBuilder.DropTable(
                name: "PostComments");

            migrationBuilder.DropTable(
                name: "Posts");

            migrationBuilder.DropTable(
                name: "Projects");
        }
    }
}
