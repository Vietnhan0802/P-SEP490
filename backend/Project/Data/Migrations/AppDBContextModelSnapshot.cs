﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Project.Data;

#nullable disable

namespace Project.Data.Migrations
{
    [DbContext(typeof(AppDBContext))]
    partial class AppDBContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.14")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("BusinessObjects.Entities.Projects.Position", b =>
                {
                    b.Property<Guid>("idPosition")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("idProject")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("namePosition")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("idPosition");

                    b.HasIndex("idProject");

                    b.ToTable("Positions");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Projects.ProjectInfo", b =>
                {
                    b.Property<Guid>("idProject")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("avatar")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("idAccount")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("isDeleted")
                        .HasColumnType("bit");

                    b.Property<string>("name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("process")
                        .HasColumnType("int");

                    b.Property<int>("visibility")
                        .HasColumnType("int");

                    b.HasKey("idProject");

                    b.ToTable("ProjectInfos");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Projects.ProjectMember", b =>
                {
                    b.Property<Guid>("idProjectMember")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("confirmedDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("cvUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("idAccount")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid?>("idPosition")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("idProject")
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool?>("isAcept")
                        .HasColumnType("bit");

                    b.Property<int>("type")
                        .HasColumnType("int");

                    b.HasKey("idProjectMember");

                    b.HasIndex("idPosition");

                    b.HasIndex("idProject");

                    b.ToTable("ProjectMembers");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Projects.Position", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Projects.ProjectInfo", "ProjectInfo")
                        .WithMany("Positions")
                        .HasForeignKey("idProject")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ProjectInfo");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Projects.ProjectMember", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Projects.Position", "Position")
                        .WithMany()
                        .HasForeignKey("idPosition");

                    b.HasOne("BusinessObjects.Entities.Projects.ProjectInfo", "ProjectInfo")
                        .WithMany("ProjectMembers")
                        .HasForeignKey("idProject");

                    b.Navigation("Position");

                    b.Navigation("ProjectInfo");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Projects.ProjectInfo", b =>
                {
                    b.Navigation("Positions");

                    b.Navigation("ProjectMembers");
                });
#pragma warning restore 612, 618
        }
    }
}
