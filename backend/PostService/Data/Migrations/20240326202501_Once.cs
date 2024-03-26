using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PostService.Data.Migrations
{
    /// <inheritdoc />
    public partial class Once : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Posts",
                columns: table => new
                {
                    idPost = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idProject = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    view = table.Column<int>(type: "int", nullable: false),
                    viewInDate = table.Column<int>(type: "int", nullable: false),
                    isBlock = table.Column<bool>(type: "bit", nullable: false),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Posts", x => x.idPost);
                });

            migrationBuilder.CreateTable(
                name: "PostComments",
                columns: table => new
                {
                    idPostComment = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idPost = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostComments", x => x.idPostComment);
                    table.ForeignKey(
                        name: "FK_PostComments_Posts_idPost",
                        column: x => x.idPost,
                        principalTable: "Posts",
                        principalColumn: "idPost",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PostImages",
                columns: table => new
                {
                    idPostImage = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idPost = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    image = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostImages", x => x.idPostImage);
                    table.ForeignKey(
                        name: "FK_PostImages_Posts_idPost",
                        column: x => x.idPost,
                        principalTable: "Posts",
                        principalColumn: "idPost",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PostLikes",
                columns: table => new
                {
                    idPostLike = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idPost = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostLikes", x => x.idPostLike);
                    table.ForeignKey(
                        name: "FK_PostLikes_Posts_idPost",
                        column: x => x.idPost,
                        principalTable: "Posts",
                        principalColumn: "idPost",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PostCommentLikes",
                columns: table => new
                {
                    idPostCommentLike = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idPostComment = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostCommentLikes", x => x.idPostCommentLike);
                    table.ForeignKey(
                        name: "FK_PostCommentLikes_PostComments_idPostComment",
                        column: x => x.idPostComment,
                        principalTable: "PostComments",
                        principalColumn: "idPostComment",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PostReplys",
                columns: table => new
                {
                    idPostReply = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idPostComment = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostReplys", x => x.idPostReply);
                    table.ForeignKey(
                        name: "FK_PostReplys_PostComments_idPostComment",
                        column: x => x.idPostComment,
                        principalTable: "PostComments",
                        principalColumn: "idPostComment",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PostReplyLikes",
                columns: table => new
                {
                    idPostReplyLike = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idPostReply = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostReplyLikes", x => x.idPostReplyLike);
                    table.ForeignKey(
                        name: "FK_PostReplyLikes_PostReplys_idPostReply",
                        column: x => x.idPostReply,
                        principalTable: "PostReplys",
                        principalColumn: "idPostReply",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PostCommentLikes_idPostComment",
                table: "PostCommentLikes",
                column: "idPostComment");

            migrationBuilder.CreateIndex(
                name: "IX_PostComments_idPost",
                table: "PostComments",
                column: "idPost");

            migrationBuilder.CreateIndex(
                name: "IX_PostImages_idPost",
                table: "PostImages",
                column: "idPost");

            migrationBuilder.CreateIndex(
                name: "IX_PostLikes_idPost",
                table: "PostLikes",
                column: "idPost");

            migrationBuilder.CreateIndex(
                name: "IX_PostReplyLikes_idPostReply",
                table: "PostReplyLikes",
                column: "idPostReply");

            migrationBuilder.CreateIndex(
                name: "IX_PostReplys_idPostComment",
                table: "PostReplys",
                column: "idPostComment");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PostCommentLikes");

            migrationBuilder.DropTable(
                name: "PostImages");

            migrationBuilder.DropTable(
                name: "PostLikes");

            migrationBuilder.DropTable(
                name: "PostReplyLikes");

            migrationBuilder.DropTable(
                name: "PostReplys");

            migrationBuilder.DropTable(
                name: "PostComments");

            migrationBuilder.DropTable(
                name: "Posts");
        }
    }
}
