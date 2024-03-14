using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Project.Data.Migrations
{
    /// <inheritdoc />
    public partial class Once : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProjectInfos",
                columns: table => new
                {
                    idProject = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    avatar = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    process = table.Column<int>(type: "int", nullable: false),
                    visibility = table.Column<int>(type: "int", nullable: false),
                    isDeleted = table.Column<bool>(type: "bit", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectInfos", x => x.idProject);
                });

            migrationBuilder.CreateTable(
                name: "Positions",
                columns: table => new
                {
                    idPosition = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idProject = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    namePosition = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Positions", x => x.idPosition);
                    table.ForeignKey(
                        name: "FK_Positions_ProjectInfos_idProject",
                        column: x => x.idProject,
                        principalTable: "ProjectInfos",
                        principalColumn: "idProject",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectMembers",
                columns: table => new
                {
                    idProjectMember = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idProject = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    idPosition = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    type = table.Column<int>(type: "int", nullable: false),
                    cvUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isAcept = table.Column<bool>(type: "bit", nullable: true),
                    confirmedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectMembers", x => x.idProjectMember);
                    table.ForeignKey(
                        name: "FK_ProjectMembers_Positions_idPosition",
                        column: x => x.idPosition,
                        principalTable: "Positions",
                        principalColumn: "idPosition");
                    table.ForeignKey(
                        name: "FK_ProjectMembers_ProjectInfos_idProject",
                        column: x => x.idProject,
                        principalTable: "ProjectInfos",
                        principalColumn: "idProject");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Positions_idProject",
                table: "Positions",
                column: "idProject");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectMembers_idPosition",
                table: "ProjectMembers",
                column: "idPosition");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectMembers_idProject",
                table: "ProjectMembers",
                column: "idProject");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectMembers");

            migrationBuilder.DropTable(
                name: "Positions");

            migrationBuilder.DropTable(
                name: "ProjectInfos");
        }
    }
}
