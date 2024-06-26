﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Communication.Data.Migrations
{
    /// <inheritdoc />
    public partial class Once : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Conversations",
                columns: table => new
                {
                    idConversation = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount1 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idAccount2 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    isDeletedBySender = table.Column<bool>(type: "bit", nullable: false),
                    isDeletedByReceiver = table.Column<bool>(type: "bit", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Conversations", x => x.idConversation);
                });

            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    idMessage = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idConversation = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idSender = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    isDeletedBySender = table.Column<bool>(type: "bit", nullable: false),
                    idReceiver = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    isDeletedByReceiver = table.Column<bool>(type: "bit", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    image = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    file = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isRecall = table.Column<bool>(type: "bit", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.idMessage);
                    table.ForeignKey(
                        name: "FK_Messages_Conversations_idConversation",
                        column: x => x.idConversation,
                        principalTable: "Conversations",
                        principalColumn: "idConversation",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Messages_idConversation",
                table: "Messages",
                column: "idConversation");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.DropTable(
                name: "Conversations");
        }
    }
}
