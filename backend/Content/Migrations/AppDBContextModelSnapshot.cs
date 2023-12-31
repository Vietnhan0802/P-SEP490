﻿// <auto-generated />
using System;
using Content.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Content.Migrations
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

            modelBuilder.Entity("BusinessObjects.Entities.Content.Blog", b =>
                {
                    b.Property<Guid>("idBlog")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("IdUser")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Image")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("bit");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("View")
                        .HasColumnType("int");

                    b.HasKey("idBlog");

                    b.ToTable("Blogs");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Content.BlogComment", b =>
                {
                    b.Property<Guid>("idBlogComment")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("BlogidBlog")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("IdUser")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("idBlog")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("idBlogComment");

                    b.HasIndex("BlogidBlog");

                    b.ToTable("BlogComments");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Content.BlogReply", b =>
                {
                    b.Property<Guid>("idBlogReply")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("BlogCommentidBlogComment")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("IdUser")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("idBlogComment")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("idBlogReply");

                    b.HasIndex("BlogCommentidBlogComment");

                    b.ToTable("BlogReplies");
                });

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

                    b.Property<int?>("ProjectidProject")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("View")
                        .HasColumnType("int");

                    b.Property<Guid>("idProject")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("idPost");

                    b.HasIndex("ProjectidProject");

                    b.ToTable("Posts");
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

                    b.ToTable("PostComments");
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

                    b.ToTable("PostReplies");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Projects.Project", b =>
                {
                    b.Property<int>("idProject")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("idProject"));

                    b.Property<string>("Avt")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("Status")
                        .HasColumnType("bit");

                    b.Property<string>("Visibility")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("idProject");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Content.BlogComment", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Content.Blog", "Blog")
                        .WithMany("BlogComments")
                        .HasForeignKey("BlogidBlog");

                    b.Navigation("Blog");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Content.BlogReply", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Content.BlogComment", "BlogComment")
                        .WithMany("Replies")
                        .HasForeignKey("BlogCommentidBlogComment");

                    b.Navigation("BlogComment");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Content.Post", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Projects.Project", "Project")
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

            modelBuilder.Entity("BusinessObjects.Entities.Content.Blog", b =>
                {
                    b.Navigation("BlogComments");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Content.BlogComment", b =>
                {
                    b.Navigation("Replies");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Content.Post", b =>
                {
                    b.Navigation("PostComments");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Content.PostComment", b =>
                {
                    b.Navigation("PostReplies");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Projects.Project", b =>
                {
                    b.Navigation("Posts");
                });
#pragma warning restore 612, 618
        }
    }
}
