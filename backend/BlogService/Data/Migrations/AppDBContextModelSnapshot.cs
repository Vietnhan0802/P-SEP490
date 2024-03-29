﻿// <auto-generated />
using System;
using BlogService.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace BlogService.Data.Migrations
{
    [DbContext(typeof(AppDBContext))]
    partial class AppDBContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.17")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("BusinessObjects.Entities.Blogs.Blog", b =>
                {
                    b.Property<Guid>("idBlog")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("content")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idAccount")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("isBlock")
                        .HasColumnType("bit");

                    b.Property<bool>("isDeleted")
                        .HasColumnType("bit");

                    b.Property<string>("title")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("view")
                        .HasColumnType("int");

                    b.Property<int?>("viewInDate")
                        .HasColumnType("int");

                    b.HasKey("idBlog");

                    b.ToTable("Blogs");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blogs.BlogComment", b =>
                {
                    b.Property<Guid>("idBlogComment")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("content")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idAccount")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("idBlog")
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("isDeleted")
                        .HasColumnType("bit");

                    b.HasKey("idBlogComment");

                    b.HasIndex("idBlog");

                    b.ToTable("BlogsComment");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blogs.BlogCommentLike", b =>
                {
                    b.Property<Guid>("idBlogCommentLike")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idAccount")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("idBlogComment")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("idBlogCommentLike");

                    b.HasIndex("idBlogComment");

                    b.ToTable("BlogsCommentLike");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blogs.BlogImage", b =>
                {
                    b.Property<Guid>("idBlogImage")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("idBlog")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("image")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("idBlogImage");

                    b.HasIndex("idBlog");

                    b.ToTable("BlogsImage");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blogs.BlogLike", b =>
                {
                    b.Property<Guid>("idBlogLike")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idAccount")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("idBlog")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("idBlogLike");

                    b.HasIndex("idBlog");

                    b.ToTable("BlogsLike");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blogs.BlogReply", b =>
                {
                    b.Property<Guid>("idBlogReply")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("content")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idAccount")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("idBlogComment")
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("isDeleted")
                        .HasColumnType("bit");

                    b.HasKey("idBlogReply");

                    b.HasIndex("idBlogComment");

                    b.ToTable("BlogsReply");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blogs.BlogReplyLike", b =>
                {
                    b.Property<Guid>("idBlogReplyLike")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idAccount")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("idBlogReply")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("idBlogReplyLike");

                    b.HasIndex("idBlogReply");

                    b.ToTable("BlogsReplyLike");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blogs.BlogComment", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Blogs.Blog", "Blog")
                        .WithMany("BlogComments")
                        .HasForeignKey("idBlog")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Blog");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blogs.BlogCommentLike", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Blogs.BlogComment", "BlogComment")
                        .WithMany("BlogCommentLikes")
                        .HasForeignKey("idBlogComment")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("BlogComment");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blogs.BlogImage", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Blogs.Blog", "Blog")
                        .WithMany("BlogImages")
                        .HasForeignKey("idBlog")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Blog");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blogs.BlogLike", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Blogs.Blog", "Blog")
                        .WithMany("BlogLikes")
                        .HasForeignKey("idBlog")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Blog");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blogs.BlogReply", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Blogs.BlogComment", "BlogComment")
                        .WithMany("BlogReplies")
                        .HasForeignKey("idBlogComment")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("BlogComment");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blogs.BlogReplyLike", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Blogs.BlogReply", "BlogReply")
                        .WithMany("BlogReplyLikes")
                        .HasForeignKey("idBlogReply")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("BlogReply");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blogs.Blog", b =>
                {
                    b.Navigation("BlogComments");

                    b.Navigation("BlogImages");

                    b.Navigation("BlogLikes");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blogs.BlogComment", b =>
                {
                    b.Navigation("BlogCommentLikes");

                    b.Navigation("BlogReplies");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Blogs.BlogReply", b =>
                {
                    b.Navigation("BlogReplyLikes");
                });
#pragma warning restore 612, 618
        }
    }
}
