using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Blog.Data.Migrations
{
    /// <inheritdoc />
    public partial class Once : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Blogs",
                columns: table => new
                {
                    idBlog = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    view = table.Column<int>(type: "int", nullable: false),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
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
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idBlog = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogComments", x => x.idBlogComment);
                    table.ForeignKey(
                        name: "FK_BlogComments_Blogs_idBlog",
                        column: x => x.idBlog,
                        principalTable: "Blogs",
                        principalColumn: "idBlog",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BlogImages",
                columns: table => new
                {
                    idBlogImage = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idBlog = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    image = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogImages", x => x.idBlogImage);
                    table.ForeignKey(
                        name: "FK_BlogImages_Blogs_idBlog",
                        column: x => x.idBlog,
                        principalTable: "Blogs",
                        principalColumn: "idBlog",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BlogLikes",
                columns: table => new
                {
                    idBlogLike = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idBlog = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogLikes", x => x.idBlogLike);
                    table.ForeignKey(
                        name: "FK_BlogLikes_Blogs_idBlog",
                        column: x => x.idBlog,
                        principalTable: "Blogs",
                        principalColumn: "idBlog",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BlogCommentLikes",
                columns: table => new
                {
                    idBlogCommentLike = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idBlogComment = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogCommentLikes", x => x.idBlogCommentLike);
                    table.ForeignKey(
                        name: "FK_BlogCommentLikes_BlogComments_idBlogComment",
                        column: x => x.idBlogComment,
                        principalTable: "BlogComments",
                        principalColumn: "idBlogComment",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BlogReplies",
                columns: table => new
                {
                    idBlogReply = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idBlogComment = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogReplies", x => x.idBlogReply);
                    table.ForeignKey(
                        name: "FK_BlogReplies_BlogComments_idBlogComment",
                        column: x => x.idBlogComment,
                        principalTable: "BlogComments",
                        principalColumn: "idBlogComment",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BlogReplyLikes",
                columns: table => new
                {
                    idBlogReplyLike = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idBlogReply = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogReplyLikes", x => x.idBlogReplyLike);
                    table.ForeignKey(
                        name: "FK_BlogReplyLikes_BlogReplies_idBlogReply",
                        column: x => x.idBlogReply,
                        principalTable: "BlogReplies",
                        principalColumn: "idBlogReply",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BlogCommentLikes_idBlogComment",
                table: "BlogCommentLikes",
                column: "idBlogComment");

            migrationBuilder.CreateIndex(
                name: "IX_BlogComments_idBlog",
                table: "BlogComments",
                column: "idBlog");

            migrationBuilder.CreateIndex(
                name: "IX_BlogImages_idBlog",
                table: "BlogImages",
                column: "idBlog");

            migrationBuilder.CreateIndex(
                name: "IX_BlogLikes_idBlog",
                table: "BlogLikes",
                column: "idBlog");

            migrationBuilder.CreateIndex(
                name: "IX_BlogReplies_idBlogComment",
                table: "BlogReplies",
                column: "idBlogComment");

            migrationBuilder.CreateIndex(
                name: "IX_BlogReplyLikes_idBlogReply",
                table: "BlogReplyLikes",
                column: "idBlogReply");
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
