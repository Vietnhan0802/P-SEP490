using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjectService.Data.Migrations
{
    /// <inheritdoc />
    public partial class Once : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    idProject = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
                    table.PrimaryKey("PK_Projects", x => x.idProject);
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
                        name: "FK_Positions_Projects_idProject",
                        column: x => x.idProject,
                        principalTable: "Projects",
                        principalColumn: "idProject",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProjectMembers",
                columns: table => new
                {
                    idProjectMember = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idAccount = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
                        name: "FK_ProjectMembers_Projects_idProject",
                        column: x => x.idProject,
                        principalTable: "Projects",
                        principalColumn: "idProject");
                });

            migrationBuilder.CreateTable(
                name: "Ratings",
                columns: table => new
                {
                    idRating = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idRater = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    idRated = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    idProjectMember = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    idProject = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    rating = table.Column<int>(type: "int", nullable: false),
                    comment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ratings", x => x.idRating);
                    table.ForeignKey(
                        name: "FK_Ratings_ProjectMembers_idProjectMember",
                        column: x => x.idProjectMember,
                        principalTable: "ProjectMembers",
                        principalColumn: "idProjectMember",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Ratings_Projects_idProject",
                        column: x => x.idProject,
                        principalTable: "Projects",
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

            migrationBuilder.CreateIndex(
                name: "IX_Ratings_idProject",
                table: "Ratings",
                column: "idProject");

            migrationBuilder.CreateIndex(
                name: "IX_Ratings_idProjectMember",
                table: "Ratings",
                column: "idProjectMember");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Ratings");

            migrationBuilder.DropTable(
                name: "ProjectMembers");

            migrationBuilder.DropTable(
                name: "Positions");

            migrationBuilder.DropTable(
                name: "Projects");
        }
    }
}
