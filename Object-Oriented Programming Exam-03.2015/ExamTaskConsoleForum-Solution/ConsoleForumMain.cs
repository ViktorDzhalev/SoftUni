﻿namespace ConsoleForum
{
    using ConsoleForum.Contracts;

    public class ConsoleForumMain
    {
        public static void Main()
        {
            IForum forum = new ForumExtended();
            forum.Run();
        }
    }
}