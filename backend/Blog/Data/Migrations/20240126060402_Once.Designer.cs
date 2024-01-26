﻿// <auto-generated />
using System;
using Blog.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Blog.Data.Migrations
{
    [DbContext(typeof(AppDBContext))]
    [Migration("20240126060402_Once")]
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

            modelBuilder.Entity("BusinessObjects.Entities.Blog.Blogg", b =>
                {
                    b.Property<Guid>("idBlog")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("content")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idAccount")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("isDeleted")
                        .HasColumnType("bit");

                    b.Property<string>("title")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("view")
                        .HasColumnType("int");

                    b.HasKey("idBlog");

                    b.ToTable("Blogs");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blog.BloggComment", b =>
                {
                    b.Property<Guid>("idBlogComment")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("content")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idAccount")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("idBlog")
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("isDeleted")
                        .HasColumnType("bit");

                    b.HasKey("idBlogComment");

                    b.HasIndex("idBlog");

                    b.ToTable("BlogComments");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blog.BloggCommentLike", b =>
                {
                    b.Property<Guid>("idBlogCommentLike")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idAccount")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("idBlogComment")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("idBlogCommentLike");

                    b.HasIndex("idBlogComment");

                    b.ToTable("BlogCommentLikes");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blog.BloggImage", b =>
                {
                    b.Property<Guid>("idBlogImage")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("idBlog")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("image")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("idBlogImage");

                    b.HasIndex("idBlog");

                    b.ToTable("BlogImages");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blog.BloggLike", b =>
                {
                    b.Property<Guid>("idBlogLike")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idAccount")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("idBlog")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("idBlogLike");

                    b.HasIndex("idBlog");

                    b.ToTable("BlogLikes");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blog.BloggReply", b =>
                {
                    b.Property<Guid>("idBlogReply")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("content")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idAccount")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("idBlogComment")
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("isDeleted")
                        .HasColumnType("bit");

                    b.HasKey("idBlogReply");

                    b.HasIndex("idBlogComment");

                    b.ToTable("BlogReplies");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blog.BloggReplyLike", b =>
                {
                    b.Property<Guid>("idBlogReplyLike")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idAccount")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("idBlogReply")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("idBlogReplyLike");

                    b.HasIndex("idBlogReply");

                    b.ToTable("BlogReplyLikes");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blog.BloggComment", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Blog.Blogg", "Blogg")
                        .WithMany("BloggComments")
                        .HasForeignKey("idBlog")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Blogg");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blog.BloggCommentLike", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Blog.BloggComment", "BloggComment")
                        .WithMany("BloggCommentLikes")
                        .HasForeignKey("idBlogComment")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("BloggComment");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blog.BloggImage", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Blog.Blogg", "Blogg")
                        .WithMany("BloggImages")
                        .HasForeignKey("idBlog")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Blogg");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blog.BloggLike", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Blog.Blogg", "Blogg")
                        .WithMany("BloggLikes")
                        .HasForeignKey("idBlog")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Blogg");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blog.BloggReply", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Blog.BloggComment", "BloggComment")
                        .WithMany("BloggReplies")
                        .HasForeignKey("idBlogComment")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("BloggComment");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blog.BloggReplyLike", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Blog.BloggReply", "BloggReply")
                        .WithMany("BloggReplyLikes")
                        .HasForeignKey("idBlogReply")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("BloggReply");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blog.Blogg", b =>
                {
                    b.Navigation("BloggComments");

                    b.Navigation("BloggImages");

                    b.Navigation("BloggLikes");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blog.BloggComment", b =>
                {
                    b.Navigation("BloggCommentLikes");

                    b.Navigation("BloggReplies");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blog.BloggReply", b =>
                {
                    b.Navigation("BloggReplyLikes");
                });
#pragma warning restore 612, 618
        }
    }
}
