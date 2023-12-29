using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Content.Migrations
{
    /// <inheritdoc />
    public partial class hhh : Migration
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
                    idProject = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Avt = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: false),
                    Visibility = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
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
                    ProjectidProject = table.Column<int>(type: "int", nullable: true),
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
                name: "IX_BlogComments_BlogidBlog",
                table: "BlogComments",
                column: "BlogidBlog");

            migrationBuilder.CreateIndex(
                name: "IX_BlogReplies_BlogCommentidBlogComment",
                table: "BlogReplies",
                column: "BlogCommentidBlogComment");

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BlogReplies");

            migrationBuilder.DropTable(
                name: "PostReplies");

            migrationBuilder.DropTable(
                name: "BlogComments");

            migrationBuilder.DropTable(
                name: "PostComments");

            migrationBuilder.DropTable(
                name: "Blogs");

            migrationBuilder.DropTable(
                name: "Posts");

            migrationBuilder.DropTable(
                name: "Projects");
        }
    }
}
