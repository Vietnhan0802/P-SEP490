using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Post.Data.Migrations
{
    /// <inheritdoc />
    public partial class Once : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Postts",
                columns: table => new
                {
                    idPost = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idProject = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    title = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    major = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    exp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    view = table.Column<int>(type: "int", nullable: false),
                    viewInDate = table.Column<int>(type: "int", nullable: false),
                    viewHistory = table.Column<int>(type: "int", nullable: false),
                    isBlock = table.Column<bool>(type: "bit", nullable: false),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Postts", x => x.idPost);
                });

            migrationBuilder.CreateTable(
                name: "PosttComments",
                columns: table => new
                {
                    idPostComment = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idPost = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PosttComments", x => x.idPostComment);
                    table.ForeignKey(
                        name: "FK_PosttComments_Postts_idPost",
                        column: x => x.idPost,
                        principalTable: "Postts",
                        principalColumn: "idPost",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PosttImages",
                columns: table => new
                {
                    idPostImage = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idPost = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    image = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PosttImages", x => x.idPostImage);
                    table.ForeignKey(
                        name: "FK_PosttImages_Postts_idPost",
                        column: x => x.idPost,
                        principalTable: "Postts",
                        principalColumn: "idPost",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PosttLikes",
                columns: table => new
                {
                    idPostLike = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idPost = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PosttLikes", x => x.idPostLike);
                    table.ForeignKey(
                        name: "FK_PosttLikes_Postts_idPost",
                        column: x => x.idPost,
                        principalTable: "Postts",
                        principalColumn: "idPost",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PosttCommentLikes",
                columns: table => new
                {
                    idPostCommentLike = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idPostComment = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PosttCommentLikes", x => x.idPostCommentLike);
                    table.ForeignKey(
                        name: "FK_PosttCommentLikes_PosttComments_idPostComment",
                        column: x => x.idPostComment,
                        principalTable: "PosttComments",
                        principalColumn: "idPostComment",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PosttReplies",
                columns: table => new
                {
                    idPostReply = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idPostComment = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PosttReplies", x => x.idPostReply);
                    table.ForeignKey(
                        name: "FK_PosttReplies_PosttComments_idPostComment",
                        column: x => x.idPostComment,
                        principalTable: "PosttComments",
                        principalColumn: "idPostComment",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PosttReplyLikes",
                columns: table => new
                {
                    idPostReplyLike = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idPostReply = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PosttReplyLikes", x => x.idPostReplyLike);
                    table.ForeignKey(
                        name: "FK_PosttReplyLikes_PosttReplies_idPostReply",
                        column: x => x.idPostReply,
                        principalTable: "PosttReplies",
                        principalColumn: "idPostReply",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PosttCommentLikes_idPostComment",
                table: "PosttCommentLikes",
                column: "idPostComment");

            migrationBuilder.CreateIndex(
                name: "IX_PosttComments_idPost",
                table: "PosttComments",
                column: "idPost");

            migrationBuilder.CreateIndex(
                name: "IX_PosttImages_idPost",
                table: "PosttImages",
                column: "idPost");

            migrationBuilder.CreateIndex(
                name: "IX_PosttLikes_idPost",
                table: "PosttLikes",
                column: "idPost");

            migrationBuilder.CreateIndex(
                name: "IX_PosttReplies_idPostComment",
                table: "PosttReplies",
                column: "idPostComment");

            migrationBuilder.CreateIndex(
                name: "IX_PosttReplyLikes_idPostReply",
                table: "PosttReplyLikes",
                column: "idPostReply");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PosttCommentLikes");

            migrationBuilder.DropTable(
                name: "PosttImages");

            migrationBuilder.DropTable(
                name: "PosttLikes");

            migrationBuilder.DropTable(
                name: "PosttReplyLikes");

            migrationBuilder.DropTable(
                name: "PosttReplies");

            migrationBuilder.DropTable(
                name: "PosttComments");

            migrationBuilder.DropTable(
                name: "Postts");
        }
    }
}
