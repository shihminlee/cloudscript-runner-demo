import java.io.*;
import org.mozilla.javascript.*;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.tools.shell.Global;
import java.util.concurrent.*;
import java.lang.reflect.*;
import javax.script.*;
import java.io.File;  // Import the File class
import java.io.FileNotFoundException;  // Import this class to handle errors
import java.util.Scanner; // Import the Scanner class to read text files

public class Rh {
    static String getCode(String filename) {
        try {
            File obj = new File(filename);
            Scanner reader = new Scanner(obj);
            StringBuilder s = new StringBuilder();
            while (reader.hasNextLine()) {
                String data = reader.nextLine();
                s.append(data);
                s.append(";");
            }
            return s.toString();
        } catch (FileNotFoundException e) {
            return "";
        }
    }

    public static void main(String[] args) {
        String code = getCode("/Users/shih-min.lee/Desktop/stop-example/scripts/for-java.js");

        Context rhino = Context.enter();
Object[] functionParams = new Object[] {"Other parameters",new Storage()};
rhino.setOptimizationLevel(-1);
try
{
 Scriptable scope = rhino.initStandardObjects();
 rhino.evaluateString(scope, code, "ScriptAPI", 1, null);
 Function function = (Function) scope.get("jsFunction", scope);
 Object jsResult = function.call(rhino,scope,scope,functionParams);
 System.out.println(jsResult);
}
        catch(Exception e) {
            e.printStackTrace();
        }
    }
}

public class Storage
{
 public static boolean haveFile(){
    return true;
 }
 public static void readFromFile(String fname){}
}