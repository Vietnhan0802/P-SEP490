using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BlogService.Data.Migrations
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
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    view = table.Column<int>(type: "int", nullable: true),
                    viewInDate = table.Column<int>(type: "int", nullable: true),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    isBlock = table.Column<bool>(type: "bit", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Blogs", x => x.idBlog);
                });

            migrationBuilder.CreateTable(
                name: "BlogsComment",
                columns: table => new
                {
                    idBlogComment = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idBlog = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogsComment", x => x.idBlogComment);
                    table.ForeignKey(
                        name: "FK_BlogsComment_Blogs_idBlog",
                        column: x => x.idBlog,
                        principalTable: "Blogs",
                        principalColumn: "idBlog",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BlogsImage",
                columns: table => new
                {
                    idBlogImage = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idBlog = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    image = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogsImage", x => x.idBlogImage);
                    table.ForeignKey(
                        name: "FK_BlogsImage_Blogs_idBlog",
                        column: x => x.idBlog,
                        principalTable: "Blogs",
                        principalColumn: "idBlog",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BlogsLike",
                columns: table => new
                {
                    idBlogLike = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idBlog = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogsLike", x => x.idBlogLike);
                    table.ForeignKey(
                        name: "FK_BlogsLike_Blogs_idBlog",
                        column: x => x.idBlog,
                        principalTable: "Blogs",
                        principalColumn: "idBlog",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BlogsCommentLike",
                columns: table => new
                {
                    idBlogCommentLike = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idBlogComment = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogsCommentLike", x => x.idBlogCommentLike);
                    table.ForeignKey(
                        name: "FK_BlogsCommentLike_BlogsComment_idBlogComment",
                        column: x => x.idBlogComment,
                        principalTable: "BlogsComment",
                        principalColumn: "idBlogComment",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BlogsReply",
                columns: table => new
                {
                    idBlogReply = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idBlogComment = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogsReply", x => x.idBlogReply);
                    table.ForeignKey(
                        name: "FK_BlogsReply_BlogsComment_idBlogComment",
                        column: x => x.idBlogComment,
                        principalTable: "BlogsComment",
                        principalColumn: "idBlogComment",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BlogsReplyLike",
                columns: table => new
                {
                    idBlogReplyLike = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idBlogReply = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogsReplyLike", x => x.idBlogReplyLike);
                    table.ForeignKey(
                        name: "FK_BlogsReplyLike_BlogsReply_idBlogReply",
                        column: x => x.idBlogReply,
                        principalTable: "BlogsReply",
                        principalColumn: "idBlogReply",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BlogsComment_idBlog",
                table: "BlogsComment",
                column: "idBlog");

            migrationBuilder.CreateIndex(
                name: "IX_BlogsCommentLike_idBlogComment",
                table: "BlogsCommentLike",
                column: "idBlogComment");

            migrationBuilder.CreateIndex(
                name: "IX_BlogsImage_idBlog",
                table: "BlogsImage",
                column: "idBlog");

            migrationBuilder.CreateIndex(
                name: "IX_BlogsLike_idBlog",
                table: "BlogsLike",
                column: "idBlog");

            migrationBuilder.CreateIndex(
                name: "IX_BlogsReply_idBlogComment",
                table: "BlogsReply",
                column: "idBlogComment");

            migrationBuilder.CreateIndex(
                name: "IX_BlogsReplyLike_idBlogReply",
                table: "BlogsReplyLike",
                column: "idBlogReply");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BlogsCommentLike");

            migrationBuilder.DropTable(
                name: "BlogsImage");

            migrationBuilder.DropTable(
                name: "BlogsLike");

            migrationBuilder.DropTable(
                name: "BlogsReplyLike");

            migrationBuilder.DropTable(
                name: "BlogsReply");

            migrationBuilder.DropTable(
                name: "BlogsComment");

            migrationBuilder.DropTable(
                name: "Blogs");
        }
    }
}
