package com.prodigy;

import io.javalin.Javalin;
import io.javalin.apibuilder.ApiBuilder.*;
import org.mozilla.javascript.*;
import org.mozilla.javascript.Scriptable;
import java.io.File;  // Import the File class
import java.io.FileNotFoundException;  // Import this class to handle errors
import java.util.Scanner; // Import the Scanner class to read text files

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import static io.javalin.apibuilder.ApiBuilder.path;


public class Rhino {
    static String getCode(String filename) {
        try {
            File obj = new File(filename);
            Scanner reader = new Scanner(obj);
            StringBuilder s = new StringBuilder();
            while (reader.hasNextLine()) {
                String data = reader.nextLine();
                s.append(data);
            }
            return s.toString();
        } catch (FileNotFoundException e) {
            return "";
        }
    }

    public static void main(String[] args) {
        Javalin app = Javalin.create().start(7000);
        app.get("/executeScript", ctx -> ctx.result(RunScript()));
    }

    public static String RunScript() {

        String code = getCode("./test-jedis.js");

        Jedis jedis = new Jedis();

        Context rhino = Context.enter();
        rhino.setOptimizationLevel(-1);

        Object[] functionParams = new Object[] {"Other parameters",jedis};
        try
        {
            Scriptable scope = rhino.initStandardObjects();

            rhino.evaluateString(scope, code, "TestJavaScript", 1, null);
            Function jsFunction = (Function) scope.get("jsFunction", scope);
            Object jsResult = jsFunction.call(rhino, scope, scope, functionParams);
            String result = Context.toString(jsResult);
            return result;
        }
        catch(Exception e) {
            e.printStackTrace();
        } finally {
            Context.exit();
        }

        return "Error";
    }
}

