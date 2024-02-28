﻿// <auto-generated />
using System;
using Interaction.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Interaction.Data.Migrations
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

            modelBuilder.Entity("BusinessObjects.Entities.Interaction.AccountReport", b =>
                {
                    b.Property<Guid>("idAccountReport")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("confirmedDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("content")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idReported")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("idReporter")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("status")
                        .HasColumnType("int");

                    b.HasKey("idAccountReport");

                    b.ToTable("AccountReports");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Interaction.BlogReport", b =>
                {
                    b.Property<Guid>("idBlogReport")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("confirmedDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("content")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<Guid?>("idBloged")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("idReporter")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("status")
                        .HasColumnType("int");

                    b.HasKey("idBlogReport");

                    b.ToTable("BlogReports");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Interaction.PostReport", b =>
                {
                    b.Property<Guid>("idPostReport")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("confirmedDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("content")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<Guid?>("idPosted")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("idReporter")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("status")
                        .HasColumnType("int");

                    b.HasKey("idPostReport");

                    b.ToTable("PostReports");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Interaction.Verification", b =>
                {
                    b.Property<Guid>("idVerification")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("confirmedDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idAccount")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("status")
                        .HasColumnType("int");

                    b.HasKey("idVerification");

                    b.ToTable("Verifications");
                });
#pragma warning restore 612, 618
        }
    }
}
