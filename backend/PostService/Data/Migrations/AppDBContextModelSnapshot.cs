﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PostService.Data;

#nullable disable

namespace PostService.Data.Migrations
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

            modelBuilder.Entity("BusinessObjects.Entities.Posts.Post", b =>
                {
                    b.Property<Guid>("idPost")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("content")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idAccount")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid?>("idProject")
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("isBlock")
                        .HasColumnType("bit");

                    b.Property<bool>("isDeleted")
                        .HasColumnType("bit");

                    b.Property<string>("title")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("view")
                        .HasColumnType("int");

                    b.Property<int>("viewInDate")
                        .HasColumnType("int");

                    b.HasKey("idPost");

                    b.ToTable("Posts");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Posts.PostComment", b =>
                {
                    b.Property<Guid>("idPostComment")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("content")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idAccount")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("idPost")
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("isDeleted")
                        .HasColumnType("bit");

                    b.HasKey("idPostComment");

                    b.HasIndex("idPost");

                    b.ToTable("PostComments");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Posts.PostCommentLike", b =>
                {
                    b.Property<Guid>("idPostCommentLike")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idAccount")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("idPostComment")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("idPostCommentLike");

                    b.HasIndex("idPostComment");

                    b.ToTable("PostCommentLikes");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Posts.PostImage", b =>
                {
                    b.Property<Guid>("idPostImage")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("idPost")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("image")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("idPostImage");

                    b.HasIndex("idPost");

                    b.ToTable("PostImages");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Posts.PostLike", b =>
                {
                    b.Property<Guid>("idPostLike")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idAccount")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("idPost")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("idPostLike");

                    b.HasIndex("idPost");

                    b.ToTable("PostLikes");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Posts.PostReply", b =>
                {
                    b.Property<Guid>("idPostReply")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("content")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idAccount")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("idPostComment")
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("isDeleted")
                        .HasColumnType("bit");

                    b.HasKey("idPostReply");

                    b.HasIndex("idPostComment");

                    b.ToTable("PostReplys");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Posts.PostReplyLike", b =>
                {
                    b.Property<Guid>("idPostReplyLike")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("createdDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("idAccount")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("idPostReply")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("idPostReplyLike");

                    b.HasIndex("idPostReply");

                    b.ToTable("PostReplyLikes");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Posts.PostComment", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Posts.Post", "Post")
                        .WithMany("PostComments")
                        .HasForeignKey("idPost")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Post");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Posts.PostCommentLike", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Posts.PostComment", "PostComment")
                        .WithMany("PostCommentLikes")
                        .HasForeignKey("idPostComment")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("PostComment");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Posts.PostImage", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Posts.Post", "Post")
                        .WithMany("PostImages")
                        .HasForeignKey("idPost")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Post");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Posts.PostLike", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Posts.Post", "Post")
                        .WithMany("PostLikes")
                        .HasForeignKey("idPost")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Post");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Posts.PostReply", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Posts.PostComment", "PostComment")
                        .WithMany("PostReplies")
                        .HasForeignKey("idPostComment")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("PostComment");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Posts.PostReplyLike", b =>
                {
                    b.HasOne("BusinessObjects.Entities.Posts.PostReply", "PostReply")
                        .WithMany("PostReplyLikes")
                        .HasForeignKey("idPostReply")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("PostReply");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Posts.Post", b =>
                {
                    b.Navigation("PostComments");

                    b.Navigation("PostImages");

                    b.Navigation("PostLikes");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Posts.PostComment", b =>
                {
                    b.Navigation("PostCommentLikes");

                    b.Navigation("PostReplies");
                });

            modelBuilder.Entity("BusinessObjects.Entities.Posts.PostReply", b =>
                {
                    b.Navigation("PostReplyLikes");
                });
#pragma warning restore 612, 618
        }
    }
}
