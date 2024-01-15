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

            modelBuilder.Entity("BusinessObjects.Entities.Content.Post", b =>
                {
                    b.Property<Guid>("idPost")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Exp")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("IdUser")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Image")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsBlock")
                        .HasColumnType("bit");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("bit");

                    b.Property<string>("Major")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid?>("ProjectidProject")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("View")
                        .HasColumnType("int");

                    b.Property<Guid>("idProject")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("idPost");

                    b.HasIndex("ProjectidProject");

                    b.ToTable("Post");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Content.PostComment", b =>
                {
                    b.Property<Guid>("idPostComment")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("IdUser")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("PostidPost")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("idPost")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("idPostComment");

                    b.HasIndex("PostidPost");

                    b.ToTable("PostComment");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Content.PostReply", b =>
                {
                    b.Property<Guid>("idPostReply")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("IdUser")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("PostCommentidPostComment")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("idPostComment")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("idPostReply");

                    b.HasIndex("PostCommentidPostComment");

                    b.ToTable("PostReply");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Projects.ProjectInfo", b =>
                {
                    b.Property<Guid>("idProject")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("avatar")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("idAccount")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("isDeleted")
                        .HasColumnType("bit");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("process")
                        .HasColumnType("int");

                    b.Property<int>("visibility")
                        .HasColumnType("int");

                    b.HasKey("idProject");

                    b.ToTable("ProjectInfos");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Projects.ProjectInvitation", b =>
                {
                    b.Property<Guid>("idProjectInvitation")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("confirmedDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idAccount")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("idProject")
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("isAccept")
                        .HasColumnType("bit");

                    b.HasKey("idProjectInvitation");

                    b.HasIndex("idProject");

                    b.ToTable("ProjectInvitations");
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

                    b.Property<string>("idAccount")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid?>("idProject")
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("isAcept")
                        .HasColumnType("bit");

                    b.Property<bool>("isManager")
                        .HasColumnType("bit");

                    b.HasKey("idProjectMember");

                    b.HasIndex("idProject");

                    b.ToTable("ProjectMembers");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Content.Post", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Projects.ProjectInfo", "Project")
                        .WithMany("Posts")
                        .HasForeignKey("ProjectidProject");

                    b.Navigation("Project");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Content.PostComment", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Content.Post", "Post")
                        .WithMany("PostComments")
                        .HasForeignKey("PostidPost");

                    b.Navigation("Post");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Content.PostReply", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Content.PostComment", "PostComment")
                        .WithMany("PostReplies")
                        .HasForeignKey("PostCommentidPostComment");

                    b.Navigation("PostComment");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Projects.ProjectInvitation", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Projects.ProjectInfo", "Project")
                        .WithMany("ProjectInvitations")
                        .HasForeignKey("idProject")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Project");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Projects.ProjectMember", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Projects.ProjectInfo", "Project")
                        .WithMany("ProjectMembers")
                        .HasForeignKey("idProject");

                    b.Navigation("Project");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Content.Post", b =>
                {
                    b.Navigation("PostComments");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Content.PostComment", b =>
                {
                    b.Navigation("PostReplies");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Projects.ProjectInfo", b =>
                {
                    b.Navigation("Posts");

                    b.Navigation("ProjectInvitations");

                    b.Navigation("ProjectMembers");
                });
#pragma warning restore 612, 618
        }
    }
}
