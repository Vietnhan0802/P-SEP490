using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Follow.Data.Migrations
{
    /// <inheritdoc />
    public partial class Once : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FollowLists",
                columns: table => new
                {
                    idFollowList = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idOwner = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FollowLists", x => x.idFollowList);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FollowLists");
        }
    }
}
