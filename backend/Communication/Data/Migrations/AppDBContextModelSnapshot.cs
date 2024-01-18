﻿// <auto-generated />
using System;
using Communication.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Communication.Data.Migrations
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

            modelBuilder.Entity("BusinessObjects.Entities.Communication.Conversation", b =>
                {
                    b.Property<Guid>("idConversation")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idAccount1")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("idAccount2")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("idConversation");

                    b.ToTable("Conversations");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Communication.Message", b =>
                {
                    b.Property<Guid>("idMessage")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("idConversation")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("idReceiver")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("idSender")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool?>("isDeleted")
                        .HasColumnType("bit");

                    b.HasKey("idMessage");

                    b.HasIndex("idConversation");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Communication.Message", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Communication.Conversation", "Conversation")
                        .WithMany("Messages")
                        .HasForeignKey("idConversation")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Conversation");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Communication.Conversation", b =>
                {
                    b.Navigation("Messages");
                });
#pragma warning restore 612, 618
        }
    }
}
