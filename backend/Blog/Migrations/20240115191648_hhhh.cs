using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Blog.Migrations
{
    /// <inheritdoc />
    public partial class hhhh : Migration
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
                name: "BlogComments",
                columns: table => new
                {
                    idBlogComment = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    idBlog = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BlogsidBlog = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IdUser = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogComments", x => x.idBlogComment);
                    table.ForeignKey(
                        name: "FK_BlogComments_Blogs_BlogsidBlog",
                        column: x => x.BlogsidBlog,
                        principalTable: "Blogs",
                        principalColumn: "idBlog");
                });

            migrationBuilder.CreateTable(
                name: "BlogImages",
                columns: table => new
                {
                    idBlogImage = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    imageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    idBlog = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BlogsidBlog = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogImages", x => x.idBlogImage);
                    table.ForeignKey(
                        name: "FK_BlogImages_Blogs_BlogsidBlog",
                        column: x => x.BlogsidBlog,
                        principalTable: "Blogs",
                        principalColumn: "idBlog");
                });

            migrationBuilder.CreateTable(
                name: "BlogLikes",
                columns: table => new
                {
                    idBlogLike = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    idBlog = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BlogidBlog = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogLikes", x => x.idBlogLike);
                    table.ForeignKey(
                        name: "FK_BlogLikes_Blogs_BlogidBlog",
                        column: x => x.BlogidBlog,
                        principalTable: "Blogs",
                        principalColumn: "idBlog");
                });

            migrationBuilder.CreateTable(
                name: "BlogCommentLikes",
                columns: table => new
                {
                    idBlogCommentLike = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    idBlogComment = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BlogCommentidBlogComment = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogCommentLikes", x => x.idBlogCommentLike);
                    table.ForeignKey(
                        name: "FK_BlogCommentLikes_BlogComments_BlogCommentidBlogComment",
                        column: x => x.BlogCommentidBlogComment,
                        principalTable: "BlogComments",
                        principalColumn: "idBlogComment");
                });

            migrationBuilder.CreateTable(
                name: "BlogReplies",
                columns: table => new
                {
                    idBlogReply = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    idBlogComment = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BlogCommentidBlogComment = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
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
                name: "BlogReplyLikes",
                columns: table => new
                {
                    idBlogReplyLike = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    idBlogReply = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BlogReplyidBlogReply = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogReplyLikes", x => x.idBlogReplyLike);
                    table.ForeignKey(
                        name: "FK_BlogReplyLikes_BlogReplies_BlogReplyidBlogReply",
                        column: x => x.BlogReplyidBlogReply,
                        principalTable: "BlogReplies",
                        principalColumn: "idBlogReply");
                });

            migrationBuilder.CreateIndex(
                name: "IX_BlogCommentLikes_BlogCommentidBlogComment",
                table: "BlogCommentLikes",
                column: "BlogCommentidBlogComment");

            migrationBuilder.CreateIndex(
                name: "IX_BlogComments_BlogsidBlog",
                table: "BlogComments",
                column: "BlogsidBlog");

            migrationBuilder.CreateIndex(
                name: "IX_BlogImages_BlogsidBlog",
                table: "BlogImages",
                column: "BlogsidBlog");

            migrationBuilder.CreateIndex(
                name: "IX_BlogLikes_BlogidBlog",
                table: "BlogLikes",
                column: "BlogidBlog");

            migrationBuilder.CreateIndex(
                name: "IX_BlogReplies_BlogCommentidBlogComment",
                table: "BlogReplies",
                column: "BlogCommentidBlogComment");

            migrationBuilder.CreateIndex(
                name: "IX_BlogReplyLikes_BlogReplyidBlogReply",
                table: "BlogReplyLikes",
                column: "BlogReplyidBlogReply");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BlogCommentLikes");

            migrationBuilder.DropTable(
                name: "BlogImages");

            migrationBuilder.DropTable(
                name: "BlogLikes");

            migrationBuilder.DropTable(
                name: "BlogReplyLikes");

            migrationBuilder.DropTable(
                name: "BlogReplies");

            migrationBuilder.DropTable(
                name: "BlogComments");

            migrationBuilder.DropTable(
                name: "Blogs");
        }
    }
}
