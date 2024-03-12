﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Notification.Data;

#nullable disable

namespace Notification.Data.Migrations
{
    [DbContext(typeof(AppDBContext))]
    [Migration("20240311075909_Once")]
    partial class Once
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.14")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("BusinessObjects.Entities.Notification.Notificationn", b =>
                {
                    b.Property<Guid>("idNotification")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("content")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idReceiver")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("idSender")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool?>("isRead")
                        .HasColumnType("bit");

                    b.Property<string>("url")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("idNotification");

                    b.ToTable("Notifications");
                });
#pragma warning restore 612, 618
        }
    }
}
