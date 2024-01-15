using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Blog.Migrations
{
    /// <inheritdoc />
    public partial class hh : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Blogs",
                columns: table => new
                {
                    idBlog = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    View = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    IdUser = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Blogs", x => x.idBlog);
                });

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
                name: "BlogComments",
                columns: table => new
                {
                    idBlogComment = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    idBlog = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BlogidBlog = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IdUser = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogComments", x => x.idBlogComment);
                    table.ForeignKey(
                        name: "FK_BlogComments_Blogs_BlogidBlog",
                        column: x => x.BlogidBlog,
                        principalTable: "Blogs",
                        principalColumn: "idBlog");
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
                name: "BlogReplies",
                columns: table => new
                {
                    idBlogReply = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    idBlogComment = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BlogCommentidBlogComment = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IdUser = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogReplies", x => x.idBlogReply);
                    table.ForeignKey(
                        name: "FK_BlogReplies_BlogComments_BlogCommentidBlogComment",
                        column: x => x.BlogCommentidBlogComment,
                        principalTable: "BlogComments",
                        principalColumn: "idBlogComment");
                });

            migrationBuilder.CreateTable(
                name: "PostComment",
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
                    table.PrimaryKey("PK_PostComment", x => x.idPostComment);
                    table.ForeignKey(
                        name: "FK_PostComment_Posts_PostidPost",
                        column: x => x.PostidPost,
                        principalTable: "Posts",
                        principalColumn: "idPost");
                });

            migrationBuilder.CreateTable(
                name: "PostReply",
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
                    table.PrimaryKey("PK_PostReply", x => x.idPostReply);
                    table.ForeignKey(
                        name: "FK_PostReply_PostComment_PostCommentidPostComment",
                        column: x => x.PostCommentidPostComment,
                        principalTable: "PostComment",
                        principalColumn: "idPostComment");
                });

            migrationBuilder.CreateIndex(
                name: "IX_BlogComments_BlogidBlog",
                table: "BlogComments",
                column: "BlogidBlog");

            migrationBuilder.CreateIndex(
                name: "IX_BlogReplies_BlogCommentidBlogComment",
                table: "BlogReplies",
                column: "BlogCommentidBlogComment");

            migrationBuilder.CreateIndex(
                name: "IX_PostComment_PostidPost",
                table: "PostComment",
                column: "PostidPost");

            migrationBuilder.CreateIndex(
                name: "IX_PostReply_PostCommentidPostComment",
                table: "PostReply",
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
                name: "BlogReplies");

            migrationBuilder.DropTable(
                name: "PostReply");

            migrationBuilder.DropTable(
                name: "ProjectInvitation");

            migrationBuilder.DropTable(
                name: "ProjectMember");

            migrationBuilder.DropTable(
                name: "BlogComments");

            migrationBuilder.DropTable(
                name: "PostComment");

            migrationBuilder.DropTable(
                name: "Blogs");

            migrationBuilder.DropTable(
                name: "Posts");

            migrationBuilder.DropTable(
                name: "Projects");
        }
    }
}
