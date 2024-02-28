using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Interaction.Data.Migrations
{
    /// <inheritdoc />
    public partial class Once : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AccountReports",
                columns: table => new
                {
                    idAccountReport = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idReporter = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idReported = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    status = table.Column<int>(type: "int", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    confirmedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccountReports", x => x.idAccountReport);
                });

            migrationBuilder.CreateTable(
                name: "BlogReports",
                columns: table => new
                {
                    idBlogReport = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idReporter = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idBloged = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    status = table.Column<int>(type: "int", nullable: true),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    confirmedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogReports", x => x.idBlogReport);
                });

            migrationBuilder.CreateTable(
                name: "PostReports",
                columns: table => new
                {
                    idPostReport = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idReporter = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idPosted = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    status = table.Column<int>(type: "int", nullable: true),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    confirmedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostReports", x => x.idPostReport);
                });

            migrationBuilder.CreateTable(
                name: "Verifications",
                columns: table => new
                {
                    idVerification = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    status = table.Column<int>(type: "int", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    confirmedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Verifications", x => x.idVerification);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AccountReports");

            migrationBuilder.DropTable(
                name: "BlogReports");

            migrationBuilder.DropTable(
                name: "PostReports");

            migrationBuilder.DropTable(
                name: "Verifications");
        }
    }
}
